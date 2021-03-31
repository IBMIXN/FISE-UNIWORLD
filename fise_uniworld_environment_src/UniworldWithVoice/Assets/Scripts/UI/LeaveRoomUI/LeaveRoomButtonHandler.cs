using UnityEngine;
using UnityEngine.UI;

public class LeaveRoomButtonHandler : MonoBehaviour
{
    public bool yesButton = true;
    private Button button;

    private void Awake()
    {
        button = GetComponent<Button>();
    }

    private void OnEnable()
    {
        button.onClick.AddListener(OnClick);
    }

    private void OnDisable()
    {
        button.onClick.RemoveAllListeners();
    }

    private void OnClick()
    {
        if (yesButton)
        {
            Portal.EnterScene("Main");
        }
        LeaveRoomUI.Hide();
    }
}
