from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id','username','role']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['id','student','course']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['id','user','dp']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['id','title','description','image','price']

@admin.register(Concept)
class ConceptAdmin(admin.ModelAdmin):
    list_display = ['id','course','title','content']