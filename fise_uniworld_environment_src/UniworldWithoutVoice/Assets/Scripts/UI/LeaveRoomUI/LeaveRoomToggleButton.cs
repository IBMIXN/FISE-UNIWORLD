using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class LeaveRoomToggleButton : MonoBehaviour
{
    private Button button;
    CanvasGroup canvasGroup;

    private void Awake()
    {
        button = GetComponent<Button>();
        canvasGroup = GetComponent<CanvasGroup>();
        Hide();
    }

    private void OnEnable()
    {
        button.onClick.AddListener(OnClick);
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    private void OnDisable()
    {
        button.onClick.RemoveAllListeners();
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    private void OnClick()
    {
        LeaveRoomUI.Toggle();
    }

    private void Show()
    {
        CanvasUtils.Show(canvasGroup);
    }

    private void Hide()
    {
        CanvasUtils.Hide(canvasGroup);
    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        if(scene.name != "Main" && scene.name != "Connect")
        {
            Show();
        }
        else
        {
            Hide();
        }
    }
}
