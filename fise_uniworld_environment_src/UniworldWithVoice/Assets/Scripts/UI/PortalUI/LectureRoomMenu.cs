using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LectureRoomMenu : MonoBehaviour
{
    public GameObject lectureRoomMenuItemPrefab;

    private async void Start()
    {
        var rooms = await LectureRoomAPI.GetLectureRooms();
        GameObject obj;
        LectureRoomMenuItem roomMenuItem;
        foreach (LectureRoomAPI.LectureRoom room in rooms)
        {
            obj = Instantiate(lectureRoomMenuItemPrefab, transform);
            roomMenuItem = obj.GetComponent<LectureRoomMenuItem>();
            roomMenuItem.SetLectureRoomInfo(room);
        }
    }
}
