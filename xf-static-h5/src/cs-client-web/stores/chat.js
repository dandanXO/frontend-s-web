/*eslint global-require: "error"*/

import { defineStore, acceptHMRUpdate } from "pinia";
import chatStatusEnum from "src/cs-client-web/enum/chatStatusEnum";
import collect from "collect.js";
import LocalStorage from "src/cs-client-web/utils/local-storage";

let dbMessages = require("./data.json");

export const useChatStore = defineStore("chat", {
  state: () => ({
    prefixId: "",
    roomId: "",
    mode_type: "",
    prevRoomId: "",
    tab: "info",
    room: {
      roomName: "",
      newMessages: [],
      messagesHistory: [],
      users: [],
      status: "WAIT_MATCH"
    },
    rooms: [],
    roomList: [],
    chatList: JSON.parse(LocalStorage.getItem("chatList")),
    // chatList: LocalStorage.get("chatList"),
    messages: [],
    newMessages: [],
    messagesHistory: [],
    messageClickable: true,
    sendMessages: [],
    isChatEnded: false,
    chatFreeze: false,
    hasRateChat: false
  }),

  getters: {
    currentRoom(state) {
      if (state.roomId) {
        return this.getRoomById(state.roomId);
      }

      return null;
    }
  },

  actions: {
    isRoomExists(id) {
      let index = this.roomList.findIndex((x) => {
        return x.id == id;
      });

      return index > -1;
    },
    addRooms(rooms) {
      if (!Array.isArray(rooms)) {
        rooms = [rooms];
      }

      for (let index in rooms) {
        let room = rooms[index];

        room.agents = room.agents.split(",");

        if (!this.isRoomExists(room.id)) {
          room._id = 1;
          room.isMessagesHistoryRequested = false;
          room.messages = [];
          room.newMessages = [];
          room.messagesHistory = [];
          room.lastMessage = {};
          room.newCount = 0;
          room.userInfo;

          this.roomList.push(room);
        } else {
          this.updateRoom(room);
        }
      }
    },
    updateRoom(room) {
      if (!room) {
        return null;
      }

      let index = this.roomList.findIndex((x) => x.id == room.id);

      if (index > -1) {
        if (room.status === chatStatusEnum.CLOSED) {
          this.roomList.splice(index, 1);
          return true;
        }

        this.roomList[index].status = room.status;
        this.roomList[index].agents = room.agents;
        return true;
      }

      return false;
    },
    getRoomById(id) {
      if (!id) {
        return null;
      }

      let index = this.roomList.findIndex((x) => {
        return x.id == id;
      });

      if (index > -1) {
        return this.roomList[index];
      }

      return null;
    },
    addChat(id, messages) {
      messages = collect(messages)
        .map((data) => {
          return JSON.parse(data).body;
        })
        .all();

      // console.log("add chat", messages);
      this.chatList.push({ id: id, messages: messages, unseenCount: 0 });
    },
    getChatById(id) {
      let index = this.chatList.findIndex((x) => x.id == id);
      // console.log("get chat", index);
      if (index > -1) {
        // console.log("chat data", this.chatList[index]);
        return this.chatList[index];
      }

      return null;
    },
    setChat(id, data) {
      let chatList = JSON.parse(LocalStorage.getItem("chatList")) ?? {};

      chatList[id] = data;
      LocalStorage.set("chatList", JSON.stringify(chatList));

      this.chatList = chatList;
    },
    getChat(id) {
      let chatList = JSON.parse(LocalStorage.getItem("chatList"));

      // console.log("get chat", id, chatList, chatList && id in chatList);

      return chatList && id in chatList ? chatList[id] : {};
    },
    deleteChat(id) {
      let chatList = JSON.parse(LocalStorage.getItem("chatList"));

      if (chatList && id in chatList) {
        delete chatList[id];
      }

      LocalStorage.set("chatList", JSON.stringify(chatList));
    },
    addRoomMessagesHistory(roomId, message) {
      let room = this.getRoomById(roomId);

      if (room) {
        room.messagesHistory.push(message);
        room.lastMessage.content = message.msg;
        room.newCount++;
      }
    },
    async getMessages() {
      await this.messages.push(...dbMessages);
    },
    loadMoreMessages(roomId, pageNo, pageSize = 25) {
      let room = this.getRoomById(roomId);

      if (!room) {
        return null;
      }

      let messages = room.messagesHistory ?? [];

      let msgTotal = messages.length;
      let pageTotal = Math.ceil(msgTotal / pageSize);

      if (pageNo < 1) {
        pageNo = 1;
      }

      if (pageNo > pageTotal) {
        return null;
      }

      let pageEnd = msgTotal - (pageNo - 1) * pageSize;
      let pageStart = pageEnd - pageSize;

      if (pageStart < 0) {
        pageStart = 0;
      }

      return messages.slice(pageStart, pageEnd);
    },
    addSendMessage(message) {
      let count = collect(this.sendMessages).where("_id", message._id).count();
      if (!count) {
        this.sendMessages.push(message);
      }
    },
    getSendMessage(_id) {
      return collect(this.sendMessages).where("_id", _id).first();
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot));
}
