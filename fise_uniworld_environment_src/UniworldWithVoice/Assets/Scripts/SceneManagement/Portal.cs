using UnityEngine;
using UnityEngine.SceneManagement;

public class Portal : MonoBehaviour
{
    public string sceneName;

    void OnTriggerEnter(Collider obj)
    {
        if (CheckMyPlayer(obj))
        {
            if (sceneName == "Main")
            {
                LeaveRoomUI.Show();
            }
            else if (sceneName == "EventHall")
            {
                PortalUI.ShowEventRoomMenu();
            }
            else if (sceneName == "LectureHall")
            {
                PortalUI.ShowLectureRoomMenu();
            }
            else
            {
                PortalUI.ShowEnterRoomDialog(sceneName);
            }
        }
    }

    void OnTriggerExit(Collider obj)
    {
        if (CheckMyPlayer(obj))
        {
            if(sceneName == "Main")
            {
                LeaveRoomUI.Hide();
            }
            if(sceneName == "EventHall")
            {
                PortalUI.HideEventRoomMenu();
            }
            else if (sceneName == "LectureHall")
            {
                PortalUI.HideLectureRoomMenu();
            }
            else
            {
                PortalUI.HideEnterRoomDialog();
            }
        }
    }

    private bool CheckMyPlayer(Collider obj)
    {
        return obj.CompareTag("Player") && PlayerController.LocalInstance != null && obj.transform.Equals(PlayerController.LocalInstance.transform);
    }

    public static void EnterScene(string sceneName)
    {
        SceneFader.HideScene();
        StateManager.PreviousScene = SceneManager.GetActiveScene().name;
        NetworkManager.ChangeRoom(sceneName);
    }

    public static async void EnterEventRoom(string id)
    {
        SceneFader.HideScene();
        var ev = await EventRoomAPI.GetEventRoomById(id);
        EnterScene("Event Hall - " + ev.title);
    }

    public static async void EnterLectureRoom(string id)
    {
        SceneFader.HideScene();
        var lectureRoom = await LectureRoomAPI.GetLectureRoomById(id);
        EnterScene("Lecture Hall - " + lectureRoom.title);
    }
}
