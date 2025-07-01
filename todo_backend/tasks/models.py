from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    PRIORITY_CHOICES = [ # Priority levels for tasks
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    TAG_CHOICES = [ # Tags for categorizing tasks
        ('work', 'Work'),
        ('study', 'Study'),
        ('personal', 'Personal'),
        ('urgent', 'Urgent'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    deadline = models.DateField(null=True, blank=True)
    reminder = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Priority and tag fields for task categorization
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, default='personal')

    def __str__(self):
        return self.title