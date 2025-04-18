import discord
from discord.ext import commands
import os
from dotenv import load_dotenv

# Umgebungsvariablen laden
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
CHANNEL_ID = int(os.getenv("CHANNEL_ID", 0))  # Standardwert 0 falls nicht gesetzt

# Nur die nötigen Intents aktivieren (Sicherheitsaspekt)
intents = discord.Intents.default()
intents.members = True  # Notwendig für on_member_join

# Initialisiere den Bot mit einem gewünschten Command-Prefix, z.B. '!'
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Bot ist eingeloggt als {bot.user}')

@bot.event
async def on_member_join(member):
    # Hole den Channel, in den du die Nachricht senden möchtest.
    channel = member.guild.get_channel(CHANNEL_ID)
    if channel:
        await channel.send(f"Willkommen auf dem Server, {member.mention}!")
    else:
        print("Der angegebene Channel wurde nicht gefunden.")

# Starte den Bot
bot.run(TOKEN)
