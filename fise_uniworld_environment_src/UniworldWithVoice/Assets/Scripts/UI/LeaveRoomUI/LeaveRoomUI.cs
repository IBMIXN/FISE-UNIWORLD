using UnityEngine;

public class LeaveRoomUI : MonoBehaviour
{
    public static LeaveRoomUI Instance;
    public CanvasGroup leaveRoomConfirmUI;
    public bool isDisplayed = false;

    private void Awake()
    {
        if (!Instance)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
        Hide();
    }

    public static void Toggle()
    {
        if (Instance != null)
        {
            if (Instance.isDisplayed)
            {
                Hide();
            }
            else
            {
                Show();
            }
        }
    }

    public static void Show()
    {
        if (Instance != null)
        {
            Instance.isDisplayed = true;
            CanvasUtils.Show(Instance.leaveRoomConfirmUI);
        }
    }

    public static void Hide()
    {
        if (Instance != null)
        {
            Instance.isDisplayed = false;
            CanvasUtils.Hide(Instance.leaveRoomConfirmUI);
        }
    }
}
