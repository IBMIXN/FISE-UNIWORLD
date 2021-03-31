using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EventRoomMenu : MonoBehaviour
{
    public GameObject roomMenuItemPrefab;

    private async void Start()
    {
        var rooms = await EventRoomAPI.GetEventRooms();
        GameObject obj;
        EventRoomMenuItem roomMenuItem;
        foreach (var room in rooms)
        {
            obj = Instantiate(roomMenuItemPrefab, transform);
            roomMenuItem = obj.GetComponent<EventRoomMenuItem>();
            roomMenuItem.SetRoomId(room._id);
            roomMenuItem.SetRoomName(room.title);
            roomMenuItem.SetRoomDate(room.eventDate);
        }
    }
}
