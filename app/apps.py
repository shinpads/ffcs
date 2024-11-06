from django.apps import AppConfig
import os

class AppConfig(AppConfig):
    name = 'app'

    def ready(self):
        run_once = os.environ.get('SCHED_RUN_ONCE')
        if run_once is not None:
            return
        os.environ['SCHED_RUN_ONCE'] = 'True'
        
        # from . import scheduler
        # scheduler.start()
