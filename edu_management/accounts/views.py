from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import User, StudentProfile, TeacherProfile

def login_view(request):
    error_message = None
    if request.method == 'POST':
        identifier = request.POST.get('username') # Email ya Username dono handle karne ke liye
        password = request.POST.get('password')
        
        user = None
        if '@' in identifier:
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(request, username=identifier, password=password)
            
        if user is not None:
            login(request, user)
            return redirect('dashboard_redirect')
        else:
            error_message = "Invalid email or password."
            
    return render(request, 'accounts/login.html', {'error_message': error_message})

def student_register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        full_name = request.POST.get('full_name')
        phone = request.POST.get('phone')

        user = User.objects.create_user(username=username, email=email, password=password, role=User.Role.STUDENT)
        StudentProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone
        )
        login(request, user)
        return redirect('student_dashboard')
    return render(request, 'accounts/register.html')

def teacher_register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        full_name = request.POST.get('full_name')
        phone = request.POST.get('phone')
        qualification = request.POST.get('qualification')
        skills = request.POST.get('skills')
        specialization = request.POST.get('specialization')
        experience = request.POST.get('experience')
        cv = request.FILES.get('cv')

        user = User.objects.create_user(username=username, email=email, password=password, role=User.Role.TEACHER)
        TeacherProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            qualification=qualification,
            skills=skills,
            specialization=specialization,
            experience=experience,
            cv=cv
        )
        login(request, user)
        return redirect('teacher_dashboard')
    return render(request, 'accounts/register.html')

@login_required
def dashboard_redirect(request):
    if request.user.role == 'ADMIN':
        return redirect('admin_dashboard')
    elif request.user.role == 'TEACHER':
        return redirect('teacher_dashboard')
    elif request.user.role == 'STUDENT':
        return redirect('student_dashboard')
    return redirect('login')

@login_required
def student_dashboard(request):
    return render(request, 'student_panel/dashboard.html')

@login_required
def teacher_dashboard(request):
    return render(request, 'teacher_panel/dashboard.html')

@login_required
def admin_dashboard(request):
    if request.user.role != 'ADMIN':
        return redirect('dashboard_redirect')
    return render(request, 'admin_panel/dashboard.html')