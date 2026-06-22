"""Initial dummy data — mirrors the frontend store so the API and the UI match.

Items are stored as schemaless JSON documents (each gets a generated ``id``),
exactly like the React localStorage layer they replace.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from .security import hash_password


def _iso(days_ago: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(days=days_ago)).isoformat()


SERVICES = [
    {"icon": "⚡", "badge": "Enterprise", "title": "ERP Integration", "color": "#E8192C", "desc": "Comprehensive enterprise resource planning solutions that integrate all your business processes into a single unified, efficient system.", "features": ["Real-time analytics & reporting dashboards", "End-to-end process automation", "Multi-department synchronization", "Custom workflows & approval chains", "Advanced security & compliance tools", "Mobile-ready interface"]},
    {"icon": "🤝", "badge": "Sales & CX", "title": "CRM Solutions", "color": "#0072CE", "desc": "Build stronger customer relationships and drive measurable sales growth with AI-driven CRM platforms tailored to your business model.", "features": ["Intelligent lead scoring & tracking", "Visual sales pipeline management", "Deep customer behavioural insights", "360° customer profile view", "Automated follow-up sequences", "Revenue forecasting & reports"]},
    {"icon": "💻", "badge": "Custom Build", "title": "Custom Development", "color": "#7c3aed", "desc": "Bespoke software engineered from scratch to match your exact business requirements — on time, on budget, and built to scale.", "features": ["Domain-specific architecture design", "RESTful & GraphQL API integration", "Microservices & monolith options", "CI/CD pipeline setup", "Full QA & testing lifecycle", "Ongoing maintenance & support"]},
    {"icon": "☁️", "badge": "Cloud", "title": "Cloud Consulting", "color": "#059669", "desc": "Navigate your cloud journey with strategic planning, cost optimisation, and hands-on migration support from certified architects.", "features": ["Multi-cloud strategy roadmap", "Lift-and-shift migration planning", "FinOps & cost governance", "Security posture assessment", "Cloud-native re-architecture", "Ongoing optimisation reviews"]},
    {"icon": "🖥️", "badge": "Infrastructure", "title": "Cloud Hosting", "color": "#d97706", "desc": "Scalable, enterprise-grade cloud hosting with guaranteed SLA uptime and 24/7 proactive monitoring for critical workloads.", "features": ["99.9% uptime SLA guarantee", "Elastic auto-scaling policies", "Multi-region load balancing", "24/7 NOC monitoring & alerts", "Automated daily backups", "CDN & edge acceleration"]},
    {"icon": "🔧", "badge": "VPS Hosting", "title": "VPS Solutions", "color": "#0A1F3D", "desc": "High-performance virtual private servers with fully dedicated resources, ideal for demanding applications and development environments.", "features": ["Dedicated vCPU & RAM allocation", "Full root / administrator access", "NVMe SSD storage included", "DDoS mitigation & firewall", "One-click OS provisioning", "Hourly billing with no lock-in"]},
]

EVENTS = [
    {"title": "AI & Enterprise Summit 2025", "date": "March 15–16, 2025", "location": "Hotel Yak & Yeti, Kathmandu", "desc": "Join 2,000+ enterprise leaders for two days of keynotes, workshops, and networking on the future of AI in business.", "badge": "Open Registration", "badgeColor": "#059669", "icon": "🌐"},
    {"title": "Cloud Transformation Workshop", "date": "April 8, 2025", "location": "Virtual Event (Zoom)", "desc": "A hands-on half-day workshop covering cloud migration strategies, cost optimisation, and live Q&A with our architects.", "badge": "Free to Attend", "badgeColor": "#0072CE", "icon": "☁️"},
    {"title": "Healthcare IT Innovation Forum", "date": "May 22, 2025", "location": "Hotel Annapurna, Lalitpur", "desc": "Dedicated to healthcare technology leaders exploring EMR integration, AI diagnostics, and digital patient experiences.", "badge": "Coming Soon", "badgeColor": "#d97706", "icon": "🏥"},
    {"title": "Retail Digital Summit Nepal", "date": "June 10–11, 2025", "location": "Pokhara Convention Centre, Pokhara", "desc": "Nepal's premier retail technology conference covering omnichannel, AI personalisation, and supply chain innovation.", "badge": "Coming Soon", "badgeColor": "#d97706", "icon": "🛍️"},
]

PHOTOS = [
    {"title": "Global Technology Summit 2024", "subtitle": "Kathmandu, Nepal", "gradient": "linear-gradient(135deg, #0A1F3D, #0072CE)", "icon": "🌐"},
    {"title": "AI Innovation Workshop", "subtitle": "Pokhara Office", "gradient": "linear-gradient(135deg, #E8192C, #b01020)", "icon": "🤖"},
    {"title": "Client Awards Ceremony", "subtitle": "Lalitpur, Nepal", "gradient": "linear-gradient(135deg, #7c3aed, #4f46e5)", "icon": "🏆"},
    {"title": "Product Launch — ERP v4.0", "subtitle": "Biratnagar Office", "gradient": "linear-gradient(135deg, #059669, #047857)", "icon": "🚀"},
    {"title": "Annual Team Retreat 2024", "subtitle": "Chitwan, Nepal", "gradient": "linear-gradient(135deg, #d97706, #b45309)", "icon": "🌴"},
]

BLOGS = [
    {"category": "Technology", "categoryColor": "#0072CE", "borderColor": "#0072CE", "title": "The Future of ERP: How AI is Reshaping Enterprise Resource Planning", "excerpt": "Artificial intelligence is fundamentally changing how enterprises manage resources. Discover the key trends driving the next generation of ERP systems and what it means for your business.", "author": "Rojan Shrestha", "date": "Dec 12, 2024", "readTime": "8 min read"},
    {"category": "Industry", "categoryColor": "#059669", "borderColor": "#059669", "title": "Digital Banking 2025: Strategies for Staying Competitive", "excerpt": "With fintech disruptors gaining market share, traditional banks must accelerate their digital transformation. We explore the five strategies that separate leaders from laggards.", "author": "Anjana Karki", "date": "Dec 8, 2024", "readTime": "6 min read"},
    {"category": "Success Story", "categoryColor": "#E8192C", "borderColor": "#E8192C", "title": "How HealthPlus Reduced Admin Overhead by 70% with Our Platform", "excerpt": "When HealthPlus came to us, their staff spent more time on paperwork than patient care. In this case study, we walk through the transformation from intake to discharge.", "author": "Dr. Bishal Pandey", "date": "Nov 29, 2024", "readTime": "10 min read"},
    {"category": "Cloud", "categoryColor": "#7c3aed", "borderColor": "#7c3aed", "title": "Multi-Cloud vs Hybrid Cloud: Choosing the Right Architecture for 2025", "excerpt": "As cloud costs spiral for many enterprises, the architecture choice matters more than ever. Our cloud architects break down the real-world trade-offs with concrete cost models.", "author": "Sanjay Adhikari", "date": "Nov 22, 2024", "readTime": "7 min read"},
    {"category": "Innovation", "categoryColor": "#d97706", "borderColor": "#d97706", "title": "Generative AI in Retail: From Personalisation to Supply Chain", "excerpt": "Retailers are discovering that GenAI goes far beyond chatbots. Explore practical applications in demand forecasting, visual search, personalised promotions, and vendor negotiation.", "author": "Priya Maharjan", "date": "Nov 15, 2024", "readTime": "9 min read"},
    {"category": "Education", "categoryColor": "#E8192C", "borderColor": "#0A1F3D", "title": "Adaptive Learning Systems: Personalising Education at Scale", "excerpt": "One-size-fits-all curricula are giving way to AI-driven adaptive platforms. We explain the pedagogy behind adaptive learning and how institutions are measuring real outcomes.", "author": "Kiran Thapa", "date": "Nov 5, 2024", "readTime": "5 min read"},
]

INQUIRIES = [
    {"name": "Aarav Sharma", "email": "aarav.sharma@himalbank.com.np", "phone": "+977 9841 023456", "company": "Himalayan Retail Pvt. Ltd.", "country": "Nepal", "jobTitle": "CTO", "details": "Interested in ERP integration for our 40-store chain across Kathmandu Valley. Looking for a Q3 rollout.", "date": _iso(2)},
    {"name": "Sita Gurung", "email": "sita.gurung@medicare.com.np", "phone": "+977 9802 145778", "company": "MediCare Pokhara", "country": "Nepal", "jobTitle": "Head of IT", "details": "Need a CRM + patient portal for our hospital in Pokhara. Please share a demo and pricing.", "date": _iso(5)},
]

SETTINGS = {
    "siteName": "AI-Solution",
    "logoLetter": "A",
    "tagline": "Transforming businesses through innovative AI-powered software solutions.",
    "primaryColor": "#E8192C",
    "darkColor": "#0A1F3D",
    "accentColor": "#0072CE",
}


def default_credentials(username: str, password: str) -> dict:
    return {"username": username, "password_hash": hash_password(password)}
