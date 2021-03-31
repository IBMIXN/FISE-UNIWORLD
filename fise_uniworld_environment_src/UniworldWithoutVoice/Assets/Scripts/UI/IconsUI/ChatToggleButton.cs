using UnityEngine;
using UnityEngine.UI;

public class ChatToggleButton : MonoBehaviour
{
    private Button button;
    public bool display = false;

    void Awake()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(OnClick);
    }

    private void OnClick()
    {
        if (display)
        {
            ChatUI.ShowChat();
        }
        else
        {
            ChatUI.HideChat();
        }
    }
}
