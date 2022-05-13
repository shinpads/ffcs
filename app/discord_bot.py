import json
import os
import requests
from dotenv import load_dotenv

class DiscordBot():
    def __init__(self, bot_token, guild_id):
        load_dotenv('../foal_server/.env')
        self.auth = 'Bot {}'.format(bot_token)
        self.base_url = 'https://discord.com/api/v10'
        self.headers = {
            'Authorization': self.auth,
        }
        self.guild_id = guild_id
    

    def send_message(self, message, channel):
        url = self.base_url + '/channels/{}/messages'.format(channel)
        data = {
            'content': message
        }

        return requests.post(url, headers=self.headers, json=data)
    

    def send_dm(self, message, user_id):
        dm_url = self.base_url + '/users/@me/channels'
        send_url = self.base_url + '/channels/{id}/messages'

        dm_channel_data = {
            'recipient_id': int(user_id)
        }
        send_data = {
            'content': message
        }

        dm_channel = requests.post(dm_url, headers=self.headers, json=dm_channel_data)
        dm_channel_id = dm_channel.json()["id"]

        return requests.post(
            send_url.format(id=dm_channel_id),
            headers=self.headers,
            json=send_data
        )
    

    def create_role(self, data):
        url = self.base_url + '/guilds/{}/roles'.format(self.guild_id)

        return requests.post(url, headers=self.headers, json=data)
    

    def edit_role(self, role_id, changes):
        url = self.base_url + '/guilds/{}/roles/{}'.format(self.guild_id, role_id)

        return requests.patch(url, headers=self.headers, json=changes)
    

    def create_channel(self, data):
        url = self.base_url + '/guilds/{}/channels'.format(self.guild_id)

        return requests.post(url, headers=self.headers, json=data)
    
    def edit_channel(self, channel_id, data):
        url = self.base_url + '/channels/{}'.format(channel_id)

        return requests.patch(url, headers=self.headers, json=data)
    
    def assign_user_to_role(self, user_id, role_id):
        url = self.base_url + '/guilds/{}/members/{}/roles/{}'.format(self.guild_id, user_id, role_id)

        return requests.put(url, headers=self.headers)

    def overwrite_channel_permissions(self, channel_id, overwrite_id, allow=0, deny=0, overwrite_type=0):
        url = self.base_url + '/channels/{}/permissions/{}'.format(channel_id, overwrite_id)

        data = {
            'allow': allow,
            'deny': deny,
            'type': overwrite_type
        }

        return requests.put(url, headers=self.headers, json=data)
    
    def get_user_info(self, user_id):
        url = self.base_url + '/users/{}'.format(user_id)

        return requests.get(url, headers=self.headers)
