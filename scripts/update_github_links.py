import json

paths = [
    'packages/shared/profile_data.json',
    'apps/web/src/data/profile_data.json'
]

for p in paths:
    with open(p, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Update personal github profile
    data['personal']['github'] = 'https://github.com/albykl123'

    # 2. Update projects github URLs
    for proj in data.get('projects', []):
        pid = proj.get('id')
        if pid == 'proj-lunova':
            proj['github_url'] = 'https://github.com/albykl123/lunova-os'
        elif pid == 'proj-platform':
            proj['github_url'] = 'https://github.com/albykl123/albert-linson-platform'
        elif pid == 'proj-jarvis':
            proj['github_url'] = 'https://github.com/albykl123/jarvis-assistant'
        elif pid == 'proj-atsforge':
            proj['github_url'] = 'https://github.com/albykl123/atsforge-ai'
        elif pid == 'proj-cinematrix':
            proj['github_url'] = 'https://github.com/albykl123/cinematrix-ai'
        elif pid == 'proj-auriva':
            proj['github_url'] = 'https://github.com/albykl123/auriva'
        elif pid == 'proj-mcd':
            proj['github_url'] = 'https://github.com/albykl123/mcd-civic-dashboard'
        elif pid == 'proj-bots':
            proj['github_url'] = 'https://github.com/albykl123/speechobot'

    # Also add working GitHub repositories from albykl123 into a dedicated property if useful
    data['github_repositories'] = [
        {
            "name": "albert-linson-platform",
            "full_name": "albykl123/albert-linson-platform",
            "url": "https://github.com/albykl123/albert-linson-platform",
            "description": "Albert Linson Personal Intelligence Platform & Edge Career OS with AI Digital Twin, ATSForge, and Recruiter Intelligence",
            "language": "TypeScript",
            "is_source": True,
            "visibility": "private",
            "role": "Primary Architecture"
        },
        {
            "name": "lunova-os",
            "full_name": "albykl123/lunova-os",
            "url": "https://github.com/albykl123/lunova-os",
            "description": "Lunova OS 1.0 Aurora — Beyond the Desktop. Debian 13 Trixie + KDE Plasma 6 Linux Distribution",
            "language": "QML / C++",
            "is_source": True,
            "visibility": "public",
            "role": "Operating System Engineering"
        },
        {
            "name": "SecureUxTheme",
            "full_name": "albykl123/SecureUxTheme",
            "url": "https://github.com/albykl123/SecureUxTheme",
            "description": "Secure boot compatible in-memory Windows UxTheme patcher for custom system styling and runtime hooks",
            "language": "C / C++",
            "is_source": False,
            "visibility": "public",
            "role": "Windows Kernel & System Customization"
        },
        {
            "name": "MagiskOnWSA",
            "full_name": "albykl123/MagiskOnWSA",
            "url": "https://github.com/albykl123/MagiskOnWSA",
            "description": "Integrate Magisk root and Google Apps (OpenGApps) into Windows Subsystem for Android (WSA)",
            "language": "Shell / Android",
            "is_source": False,
            "visibility": "public",
            "role": "Android Subsystem Engineering"
        },
        {
            "name": "albert",
            "full_name": "albykl123/albert",
            "url": "https://github.com/albykl123/albert",
            "description": "All India NSSO Education Survey & Socio-Economic Statistical Modeling Research",
            "language": "Python / Jupyter",
            "is_source": True,
            "visibility": "public",
            "role": "Data Analytics & Academic Research"
        }
    ]

    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully updated {p}")
