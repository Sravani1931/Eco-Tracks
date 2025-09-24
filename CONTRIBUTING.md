# Contributing to EcoTrack

Thank you for your interest in contributing to EcoTrack! 🌱

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.11+
- MongoDB
- Git

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecotrack.git
   cd ecotrack
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your MongoDB settings
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   cp .env.example .env
   # Edit .env with your backend URL
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn server:app --reload --port 8001
   
   # Terminal 2 - Frontend
   cd frontend
   yarn start
   ```

## How to Contribute

### Reporting Bugs
- Use the bug report template
- Provide detailed steps to reproduce
- Include screenshots if applicable

### Suggesting Features
- Use the feature request template
- Explain the environmental impact
- Consider implementation complexity

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation
4. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   python -m pytest backend_test.py
   
   # Frontend tests
   cd frontend
   yarn test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add carbon footprint visualization"
   ```
6. **Push and create a PR**

## Code Style Guidelines

### Backend (Python/FastAPI)
- Follow PEP 8 style guidelines
- Use type hints
- Document functions with docstrings
- Keep functions focused and small

### Frontend (React/JavaScript)
- Use functional components with hooks
- Follow JSX best practices
- Use meaningful variable names
- Keep components focused and reusable

## Carbon Footprint Focus

When contributing, always consider:
- How does this help users track emissions?
- Does this encourage sustainable behavior?
- Are carbon calculations accurate?
- Is the environmental impact clear to users?

## Testing

- Write unit tests for new features
- Test carbon footprint calculations thoroughly
- Verify API endpoints work correctly
- Test UI components and user flows

## Documentation

- Update README.md if needed
- Document new API endpoints
- Add inline code comments
- Update setup instructions

## Code of Conduct

- Be respectful and inclusive
- Focus on environmental impact
- Help others learn about sustainability
- Provide constructive feedback

## Questions?

- Open a discussion in the GitHub Discussions tab
- Check existing issues and documentation
- Join our community conversations about sustainability

Thank you for helping make EcoTrack better and contributing to environmental awareness! 🌍