from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin','Admin'),
        ('faculty','Faculty'),
        ('student','Student'),
    ]
    role = models.CharField(max_length=20,choices=ROLE_CHOICES)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    dp = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return self.user.username

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Concept(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='concepts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    order = models.PositiveIntegerField(help_text="Order of the concept in the course")

    class Meta:
        ordering = ['order']  # Optional: ensures concepts appear in order

    def __str__(self):
        return f"{self.order}. {self.title} ({self.course.title})"
    
class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')