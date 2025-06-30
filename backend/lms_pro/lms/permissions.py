from rest_framework import permissions

# create your jwt_auth permissions here

class IsFacultyOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'faculty']