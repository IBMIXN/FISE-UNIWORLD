using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class EnterRoomDialogButton : MonoBehaviour
{
    public bool yesButton = false;
    private Button button;

    private void Awake()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(OnClick);
    }

    private void OnClick()
    {
        string roomName = PortalUI.Instance.enterRoomName;
        if (yesButton && PortalUI.Instance != null && roomName != null)
        {
            Portal.EnterScene(roomName);
        }
        PortalUI.HideEnterRoomDialog();
    }
}
