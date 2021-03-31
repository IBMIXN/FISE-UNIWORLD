using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;

[RequireComponent(typeof(Button))]
public class ObjectLinkButtonHandler : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void OpenUrlTab(string url);

    public static ObjectLinkButtonHandler instance;
    public bool yesButton = true;

    private Button button;

    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
        button = GetComponent<Button>();
    }

    private void OnEnable()
    {
        button.onClick.AddListener(OnClickHandle);
    }

    private void OnDisable()
    {
        button.onClick.RemoveAllListeners();
    }

    private void OnClickHandle()
    {
        string url = ObjectLinkConfirmUI.Instance.url;
        if (yesButton && url != null)
        {
        #if UNITY_EDITOR
            Application.OpenURL(url);
        #else
            OpenUrlTab(url);
        #endif
        }
        ObjectLinkConfirmUI.Hide();
    }
}
