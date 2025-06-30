from django.urls import path,include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

# create your jwt_auth requests here

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollment')
router.register(r'profiles', views.ProfileViewSet, basename='profile')

urlpatterns = [
    # Registration
    path("register/", views.RegistrationView.as_view(), name="register"),

    # JWT Auth
    path("login/", views.LoginView.as_view(), name="token_obtain_pair"),
    path('user/', views.UserInfoView.as_view(), name='user_info'),
    path('user/update/', views.UserUpdateView.as_view(), name='user_update'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Courses
    path('', include(router.urls)),

    # Role-Based Route Example
    # path("admin-only/", views.AdminOnlyView.as_view(), name="admin_only"),

    # Logout
    path("logout/", views.LogoutView.as_view(), name="logout"),
]
