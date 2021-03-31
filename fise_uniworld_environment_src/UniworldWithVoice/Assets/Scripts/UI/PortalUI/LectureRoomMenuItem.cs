using System;
using UnityEngine;
using UnityEngine.UI;

public class LectureRoomMenuItem : MonoBehaviour
{
    private string roomId;
    public Text lectureTitleText, lecturerText, lectureTimeText;
    public Button joinButton;

    void Start()
    {
        joinButton.onClick.AddListener(OnClick);
    }

    private void OnClick()
    {
        Portal.EnterLectureRoom(roomId);
    }

    public void SetLectureRoomInfo(LectureRoomAPI.LectureRoom lectureRoom)
    {
        roomId = lectureRoom._id;
        lectureTitleText.text = lectureRoom.title + " (" + lectureRoom.module + ")";
        lecturerText.text = lectureRoom.lecturer;
        DateTime startTime, endTime;
        if (DateTime.TryParse(lectureRoom.startTime, out startTime) && DateTime.TryParse(lectureRoom.endTime, out endTime))
        {
            lectureTimeText.text = startTime.ToString("h:mm tt") + " ~ " + endTime.ToString("h:mm tt - dd MMMM yyyy");
        }
        else
        {
            lectureTimeText.text = lectureRoom.startTime;
        }
    }
}
