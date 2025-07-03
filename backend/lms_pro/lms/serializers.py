from rest_framework import serializers
from .models import *
from django.contrib.auth.models import Group
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# create your auth serializers here

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username','password','role']
    
    def create(self, validated_data):
        user=User(
            username=validated_data['username'],
            role = validated_data.get('role','')
        )
        user.set_password(validated_data['password'])
        user.save()
        role = validated_data.get('role')

        # if role:
        #     group, _ = Group.objects.get_or_create(name=role)
        #     user.groups.add(group)
            
        return user
    


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # You can include custom claims here if needed
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user role to response data
        data['role'] = self.user.role
        return data
    

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','email','role']
        read_only_fields = ['role']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'dp']
        read_only_fields = ['id', 'user']


# class CourseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Course
#         fields = '__all__'
#         read_only_fields = ['created_by', 'created_at']


class ConceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concept
        fields = ['id', 'title', 'content', 'order']


class CourseSerializer(serializers.ModelSerializer):
    concepts = ConceptSerializer(many=True)

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']

    def create(self, validated_data):
        concepts_data = validated_data.pop('concepts', [])
        course = Course.objects.create(**validated_data)
        for concept_data in concepts_data:
            Concept.objects.create(course=course, **concept_data)
        return course

    def update(self, instance, validated_data):
        concepts_data = validated_data.pop('concepts', [])
        instance = super().update(instance, validated_data)

        # Optional: Clear and re-add concepts (simpler way)
        instance.concepts.all().delete()
        for concept_data in concepts_data:
            Concept.objects.create(course=instance, **concept_data)

        return instance




class EnrollmentSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), write_only=True
    )
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'course_details', 'student', 'enrolled_at']
        read_only_fields = ['student', 'enrolled_at']