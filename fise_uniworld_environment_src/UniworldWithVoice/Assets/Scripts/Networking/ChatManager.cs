using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Pun;
using Photon.Realtime;
using ExitGames.Client.Photon;
using UnityEngine.SceneManagement;
using System;

public class ChatManager : MonoBehaviourPun
{
    [Serializable]
    public class ClientMessage
    {
        public bool statusText;
        public string sender;
        public string message;

        public ClientMessage(string message, string sender, bool statusText = false){
            this.message = message;
            this.sender = sender;
            this.statusText = statusText;
        }
    }

    public static ChatManager Instance;

    public Dictionary<int, string> onlineUsers;

    private void Awake()
    {
        if (!Instance)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            onlineUsers = new Dictionary<int, string>();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    public static void JoinChat(string channel, Dictionary<int, Player> players)
    {
        if (ChatUI.Instance == null || OnlineUsersUI.Instance == null)
        {
            return;
        }
        Instance.onlineUsers.Clear();
        foreach (KeyValuePair<int, Player> player in players)
        {
            Instance.onlineUsers.Add(player.Key, player.Value.NickName);
        }
        ChatUI.SetChannelLabel(channel);
        ChatUI.SetOnlineUsersLabel(players.Count);
        ChatUI.ClearMessages();
        Instance.Send(PhotonNetwork.LocalPlayer.NickName + " has joined the room.", true);
    }

    public static void UserJoinedChat(Player player)
    {
        if (ChatUI.Instance == null)
        {
            return;
        }
        Instance.onlineUsers.Add(player.ActorNumber, player.NickName);
        ChatUI.SetOnlineUsersLabel(Instance.onlineUsers.Count);
    }

    public static void UserLeftChat(Player player)
    {
        if (ChatUI.Instance == null)
        {
            return;
        }
        Instance.onlineUsers.Remove(player.ActorNumber);
        ChatUI.SetOnlineUsersLabel(Instance.onlineUsers.Count);
        ChatUI.DisplayMessage(player.NickName + " has left the room.", true);
    }

    public void Send(string message, bool statusText = false)
    {
        if (!string.IsNullOrWhiteSpace(message))
        {
            photonView.RPC("SendMessage", RpcTarget.All, PhotonNetwork.LocalPlayer.NickName, message, statusText);
        }
    }

    [PunRPC]
    void SendMessage(string sender, string message, bool statusText)
    {
        ClientMessage clientMessage = new ClientMessage(message, sender, statusText);
        if (clientMessage.statusText)
        {
            ChatUI.DisplayMessage(clientMessage.message, true);
        }
        else
        {
            ChatUI.DisplayMessage(clientMessage.message, sender);
        }
    }
}
