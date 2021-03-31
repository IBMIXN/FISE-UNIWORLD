using System;
using UnityEngine;
using UnityEngine.UI;

public class EventRoomMenuItem : MonoBehaviour
{
    private string roomId;
    public Text roomNameText, roomDateText;
    public Button joinButton;

    void Start()
    {
        joinButton.onClick.AddListener(OnClick);
    }

    private void OnClick()
    {
        Portal.EnterEventRoom(roomId);
    }

    public void SetRoomId(string roomId)
    {
        this.roomId = roomId;
    }

    public void SetRoomName(string roomName)
    {
        roomNameText.text = roomName;
    }

    public void SetRoomDate(string eventDate)
    {
        DateTime dateObj;
        if (DateTime.TryParse(eventDate, out dateObj))
        {
            roomDateText.text = dateObj.ToString("dddd, dd MMMM yyyy");
        }
        else
        {
            roomDateText.text = eventDate;
        }
    }
}
