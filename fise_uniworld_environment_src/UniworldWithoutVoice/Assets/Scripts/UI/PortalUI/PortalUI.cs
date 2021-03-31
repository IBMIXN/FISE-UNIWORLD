using UnityEngine;

public class PortalUI : MonoBehaviour
{
    public static PortalUI Instance;
    public CanvasGroup enterRoomDialog, eventRoomMenu, lectureRoomMenu;
    public string enterRoomName;

    private void Awake()
    {
        Instance = this;
    }

    public static void ShowEnterRoomDialog(string roomName)
    {
        CanvasUtils.Show(Instance.enterRoomDialog);
        Instance.enterRoomName = roomName;
    }

    public static void HideEnterRoomDialog()
    {
        CanvasUtils.Hide(Instance.enterRoomDialog);
    }

    public static void ShowEventRoomMenu()
    {
        CanvasUtils.Show(Instance.eventRoomMenu);
    }

    public static void HideEventRoomMenu()
    {
        CanvasUtils.Hide(Instance.eventRoomMenu);
    }

    public static void ShowLectureRoomMenu()
    {
        CanvasUtils.Show(Instance.lectureRoomMenu);
    }

    public static void HideLectureRoomMenu()
    {
        CanvasUtils.Hide(Instance.lectureRoomMenu);
    }
}
