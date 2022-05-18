from enum import IntEnum


class ChannelTypes(IntEnum):
    GUILD_TEXT = 0
    DM = 1
    GUILD_VOICE = 2
    GROUP_DM = 3
    GUILD_CATEGORY = 4
    GUILD_NEWS = 5
    GUILD_NEWS_THREAD = 10
    GUILD_PUBLIC_THREAD = 11
    GUILD_PRIVATE_THREAD = 12
    GUILD_STAGE_VOICE = 13
    GUILD_DIRECTORY = 14
    GUILD_FORM = 15

class InteractionCallbackTypes(IntEnum):
    PONG = 1
    CHANNEL_MESSAGE_WITH_SOURCE = 4
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5
    DEFERRED_UPDATE_MESSAGE = 6
    UPDATE_MESSAGE = 7
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8
    MODAL = 9

class ScheduledEventEntityType(IntEnum):
    STAGE_INSTANCE = 1
    VOICE = 2
    EXTERNAL = 3

permissions = {
    'CREATE_INSTANT_INVITE': (1 << 0),
    'KICK_MEMBERS': (1 << 1),
    'BAN_MEMBERS': (1 << 2),
    'ADMINISTRATOR': (1 << 3),
    'MANAGE_CHANNELS': (1 << 4),
    'MANAGE_GUILD': (1 << 5),
    'ADD_REACTIONS': (1 << 6),
    'VIEW_AUDIT_LOG': (1 << 7),
    'PRIORITY_SPEAKER': (1 << 8),
    'STREAM': (1 << 9),
    'VIEW_CHANNEL': (1 << 10),
    'SEND_MESSAGES': (1 << 11),
    'SEND_TTS_MESSAGES': (1 << 12),
    'MANAGE_MESSAGES': (1 << 13),
    'EMBED_LINKS': (1 << 14),
    'ATTACH_FILES': (1 << 15),
    'READ_MESSAGE_HISTORY': (1 << 16),
    'MENTION_EVERYONE': (1 << 17),
    'USE_EXTERNAL_EMOJIS': (1 << 18),
    'VIEW_GUILD_INSIGHTS': (1 << 19),
    'CONNECT': (1 << 20),
    'SPEAK': (1 << 21),
    'MUTE_MEMBERS': (1 << 22),
    'DEAFEN_MEMBERS': (1 << 23),
    'MOVE_MEMBERS': (1 << 24),
    'USE_VAD': (1 << 25),
    'CHANGE_NICKNAME': (1 << 26),
    'MANAGE_NICKNAMES': (1 << 27),
    'MANAGE_ROLES': (1 << 28),
    'MANAGE_WEBHOOKS': (1 << 29),
    'MANAGE_EMOJIS_AND_STICKERS': (1 << 30),
    'USE_APPLICATION_COMMANDS': (1 << 31),
    'REQUEST_TO_SPEAK': (1 << 32),
    'MANAGE_EVENTS': (1 << 33),
    'MANAGE_THREADS': (1 << 34),
    'CREATE_PUBLIC_THREADS': (1 << 35),
    'CREATE_PRIVATE_THREADS': (1 << 36),
    'USE_EXTERNAL_STICKERS': (1 << 37),
    'SEND_MESSAGES_IN_THREADS': (1 << 38),
    'USE_EMBEDDED_ACTIVITIES': (1 << 39),
    'MODERATE_MEMBERS': (1 << 40)
}
