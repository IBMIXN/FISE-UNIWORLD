using System;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using Photon.Pun;
using UnityEngine.SceneManagement;
using TMPro;

[Serializable]
public class Message
{
    public string text;
    public TextMeshProUGUI textObject;
    public Message(string text, TextMeshProUGUI textObject)
    {
        this.text = text;
    }
}

public class ChatUI : MonoBehaviour
{
    public static ChatUI Instance;
    public GameObject chatPanel, messageTextPrefab, statusTextPrefab;
    public InputField messageInputBox;
    public TextMeshProUGUI channelLabel, onlineUsersLabel;

    public CanvasGroup chatPanelGroup;

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
    }

    void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    // Joins and subscribes to a chat channel when a new scene is loaded
    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        CanvasUtils.Hide(chatPanelGroup);
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    public static void ShowChat()
    {
        IconsUI.Hide();
        CanvasUtils.Show(Instance.chatPanelGroup);
    }

    public static void HideChat()
    {
        IconsUI.Show();
        CanvasUtils.Hide(Instance.chatPanelGroup);
    }

    public static void SetChannelLabel(string channel)
    {
        Instance.channelLabel.text = channel;
    }

    public static void SetOnlineUsersLabel(int numUsers)
    {
        Instance.onlineUsersLabel.text = "[" + numUsers.ToString() + "]";
    }

    public static void ClearMessages()
    {
        TextMeshProUGUI[] messages = Instance.chatPanel.GetComponentsInChildren<TextMeshProUGUI>();
        foreach (TextMeshProUGUI message in messages)
        {
            Destroy(message.gameObject);
        }
    }

    public static void DisplayMessage(string message, string sender)
    {
        DisplayMessage(sender + ": " + message);
    }

    public static void DisplayMessage(string message, bool statusText = false)
    {
        TextMeshProUGUI textObject;
        if (statusText)
        {
            textObject = Instantiate(Instance.statusTextPrefab, Instance.chatPanel.transform).GetComponent<TextMeshProUGUI>();
        }
        else
        {
            textObject = Instantiate(Instance.messageTextPrefab, Instance.chatPanel.transform).GetComponent<TextMeshProUGUI>();
        }
        textObject.text = message;
        Debug.Log("DisplayMessage:: " + message);
    }

    public static void SendMessage()
    {
        if (!string.IsNullOrWhiteSpace(Instance.messageInputBox.text))
        {
            ChatManager.Instance.Send(Instance.messageInputBox.text);
            Instance.messageInputBox.text = "";
            EventSystem.current.SetSelectedGameObject(Instance.messageInputBox.gameObject, null);
            Instance.messageInputBox.OnPointerClick(new PointerEventData(EventSystem.current));
        }
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Return) || Input.GetKey(KeyCode.KeypadEnter))
        {
            SendMessage();
        }
    }
}
