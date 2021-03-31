using UnityEngine;
using Photon.Pun;
using Photon.Realtime;
using System.Collections.Generic;

public class NetworkManager : MonoBehaviourPunCallbacks
{
    [SerializeField] // To expose a non-public field in the Unity Inspector
    private byte maxPlayersPerRoom = 100;

    public static NetworkManager instance;
    public string changeRoomName;

    void Awake()
    {
        if (!instance)
        {
            DontDestroyOnLoad(gameObject);
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public static void Connect(string nickname)
    {
        if (!PhotonNetwork.IsConnected)
        {
            PhotonNetwork.ConnectUsingSettings();
            PhotonNetwork.NickName = nickname;
        }
    }

    public static void ChangeRoom(string roomName)
    {
        instance.changeRoomName = roomName;
        PhotonNetwork.LeaveRoom();
    }

    public static void Exit()
    {
        instance.changeRoomName = null;
        PhotonNetwork.LeaveRoom();
    }

    #region Photon Callbacks

    public override void OnConnectedToMaster()
    {
        Debug.Log("PUN: connected to master server");
        if (string.IsNullOrEmpty(changeRoomName))
        {
            if (LoadRoomFromUrl.ShouldLoadFromUrl())
            {
                PhotonNetwork.JoinOrCreateRoom(LoadRoomFromUrl.roomName, new RoomOptions { MaxPlayers = maxPlayersPerRoom }, TypedLobby.Default);
            }
            else
            {
                PhotonNetwork.JoinOrCreateRoom("Main", new RoomOptions { MaxPlayers = maxPlayersPerRoom }, TypedLobby.Default);
            }
        }
        else
        {
            PhotonNetwork.JoinOrCreateRoom(changeRoomName, new RoomOptions { MaxPlayers = instance.maxPlayersPerRoom }, TypedLobby.Default);
        }
    }

    public override void OnJoinedRoom()
    {
        string roomName = PhotonNetwork.CurrentRoom.Name;
        Debug.Log("PUN: joined room " + roomName);
        ChatManager.JoinChat(roomName, PhotonNetwork.CurrentRoom.Players);
        OnlineUsersUI.SetChannelLabel(roomName);
        OnlineUsersUI.SetOnlineUsers(PhotonNetwork.CurrentRoom.Players);
        SceneFader.HideScene();
        if(roomName.StartsWith("Event Hall"))
        {
            PhotonNetwork.LoadLevel("EventHall");
        }
        else if (roomName.StartsWith("Lecture Hall"))
        {
            PhotonNetwork.LoadLevel("LectureHall");
        }
        else
        {
            PhotonNetwork.LoadLevel(roomName);
        }
    }

    public override void OnJoinRoomFailed(short returnCode, string message)
    {
        Debug.Log("PUN: failed to join room. Reason: " + message);
    }

    public override void OnLeftRoom()
    {
        Debug.Log("PUN: left room");
    }

    public override void OnPlayerEnteredRoom(Player other)
    {
        ChatManager.UserJoinedChat(other);
        OnlineUsersUI.SetOnlineUsers(PhotonNetwork.CurrentRoom.Players);
    }

    public override void OnPlayerLeftRoom(Player other)
    {
        ChatManager.UserLeftChat(other);
        OnlineUsersUI.SetOnlineUsers(PhotonNetwork.CurrentRoom.Players);
    }

    #endregion
}
