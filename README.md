To run application follow these steps:
1. `cp .env.example .env`
2. Add valid bot tokens and DB url to `.env`
3. `docker build -t perevir_volunteer_bot .`
4. `docker run -d perevir_volunteer_bot`