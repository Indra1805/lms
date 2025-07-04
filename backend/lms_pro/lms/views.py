from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status, generics, serializers, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import *
from .permissions import IsFacultyOrAdmin
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id":user.id,
            "username":user.username,
            "first_name":user.first_name,
            "last_name":user.last_name,
            "email":user.email,
            "role":request.user.role
            })
    
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow access to the current user's profile
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        # Ensure the user only accesses their own profile
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)

        if request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:
            serializer = self.get_serializer(profile)

        return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message":"Successfully logged out !"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"message":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsFacultyOrAdmin()]
        elif self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Parse concepts JSON string
        concepts_raw = data.get('concepts')
        if isinstance(concepts_raw, str):
            try:
                concepts_list = json.loads(concepts_raw)
                data.setlist('concepts', [])  # Avoid serializer error
            except json.JSONDecodeError:
                return Response({'concepts': ['Invalid JSON format']}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'concepts': ['Missing or invalid concepts']}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save(created_by=request.user)

        # Manually save concepts
        for concept in concepts_list:
            Concept.objects.create(course=course, **concept)

        return Response(self.get_serializer(course).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # Parse concepts JSON string
        concepts_raw = data.get('concepts')
        if isinstance(concepts_raw, str):
            try:
                concepts_list = json.loads(concepts_raw)
                data.setlist('concepts', [])  # Prevent validation issues
            except json.JSONDecodeError:
                return Response({'concepts': ['Invalid JSON format']}, status=status.HTTP_400_BAD_REQUEST)
        else:
            concepts_list = None  # Allow update without changing concepts

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()

        # If concepts provided, clear and recreate
        if concepts_list is not None:
            course.concepts.all().delete()
            for concept in concepts_list:
                Concept.objects.create(course=course, **concept)

        return Response(self.get_serializer(course).data)



class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'role', '') == 'faculty':
            return Enrollment.objects.all()
        return Enrollment.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)