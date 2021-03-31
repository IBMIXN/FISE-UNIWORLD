using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LoadRoomFromUrl : MonoBehaviour
{
    public static string roomName = "Main";

    public static bool ShouldLoadFromUrl()
    {
        return (Application.absoluteURL.IndexOf("?id=") != -1 || Application.absoluteURL.IndexOf("?lid=") != -1);
    }

    private async void Awake()
    {
        int indexLid = Application.absoluteURL.IndexOf("?lid=");
        int index = Application.absoluteURL.IndexOf("?id=");
        if (indexLid != -1)
        {
            string id = Application.absoluteURL.Substring(indexLid + 5);
            var lectureRoom = await LectureRoomAPI.GetLectureRoomById(id);
            roomName = "Lecture Hall - " + lectureRoom.title;
        }
        else if (index != -1)
        {
            string id = Application.absoluteURL.Substring(index + 4);
            var eventRoom = await EventRoomAPI.GetEventRoomById(id);
            roomName = "Event Hall - " + eventRoom.title;
        }
    }
}
