using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using UnityEngine.UI;
using TMPro;

public class OnlineUsersUI : MonoBehaviour
{
    public static OnlineUsersUI Instance;
    public GameObject onlineUsersPanel, onlineUserObjPrefab;
    public TextMeshProUGUI channelLabel, onlineUserCountLabel;
    private CanvasGroup canvasGroup;
    private Dictionary<int, GameObject> onlineUserObjects;

    private void Awake()
    {
        if (!Instance)
        {
            Instance = this;
            onlineUserObjects = new Dictionary<int, GameObject>();
            canvasGroup = GetComponentInChildren<CanvasGroup>();
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

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        if (scene.name == "Connect")
        {
            CanvasUtils.Hide(canvasGroup);
        }
        else
        {
            CanvasUtils.Show(canvasGroup);
        }
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    public static void SetChannelLabel(string channel)
    {
        Instance.channelLabel.text = channel;
    }

    public void ClearList()
    {
        foreach (KeyValuePair<int, GameObject> obj in onlineUserObjects)
        {
            Destroy(obj.Value);
        }
        onlineUserObjects.Clear();
    }

    public static void SetOnlineUsers(Dictionary<int, Photon.Realtime.Player> players)
    {
        Instance.onlineUserCountLabel.text = "[" + players.Count.ToString() + "]";
        Instance.ClearList();
        GameObject obj;
        foreach (KeyValuePair<int, Photon.Realtime.Player> player in players)
        {
            int id = player.Value.ActorNumber;
            string name = player.Value.NickName;
            obj = Instantiate(Instance.onlineUserObjPrefab, Instance.onlineUsersPanel.transform);
            obj.GetComponent<TextMeshProUGUI>().text = name;
            obj.GetComponentInChildren<RawImage>().enabled = false;
            Instance.onlineUserObjects.Add(id, obj);
        }
    }

    public static void SetUserSpeakingIcon(int userActorId, bool speaking)
    {
        if (Instance.onlineUserObjects.ContainsKey(userActorId))
        {
            Instance.onlineUserObjects[userActorId].GetComponentInChildren<RawImage>().enabled = speaking;
        }
    }
}
