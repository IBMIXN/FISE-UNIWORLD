using UnityEngine.SceneManagement;
using UnityEngine;
using System.Collections.Generic;

public class EventRoomLoader : MonoBehaviour
{
    public static readonly float X_OFFSET = 6.5f, Y_OFFSET = 6.5f;
    public GameObject defaultScenePrefab;
    public Material defaultBackground;
    private Dictionary<string, GameObject> meetingTablePrefabs;

    void OnEnable()
    {
        meetingTablePrefabs = new Dictionary<string, GameObject>();
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    void LoadBackground()
    {
        var ev = EventRoomAPI.LoadedEventRoom;
        if (EventRoomAPI.IsImageUrl(ev.background) && ev.backgroundTexture != null) // Background Texture has been loaded by its url in EventRoomAPI
        {
            Material mat = new Material(Shader.Find("Skybox/Panoramic"));
            mat.mainTexture = ev.backgroundTexture;
            RenderSettings.skybox = mat;
        }
        else if (EventRoomAPI.IsVideoUrl(ev.background)) // Background should be loaded from a 360 degree video URL
        {
            VideoPlayer.PlayVideoUrl(ev.background);
        }
        else // Background selected from a preset value (e.g. UclMainQuad)
        {
            Material backgroundMat = (Material)Resources.Load("Backgrounds/" + ev.background, typeof(Material));
            if (backgroundMat == null)
            {
                RenderSettings.skybox = defaultBackground;
            }
            else
            {
                RenderSettings.skybox = backgroundMat;
            }
        }
    }

    void LoadScene()
    {
        GameObject scenePrefab = (GameObject)Resources.Load("EventScenes/" + EventRoomAPI.LoadedEventRoom.scene, typeof(GameObject));
        if (scenePrefab == null)
        {
            Instantiate(defaultScenePrefab, transform);
        }
        else
        {
            Instantiate(scenePrefab, transform);
        }
    }

    void LoadMeetingTables()
    {
        GameObject tableObject;
        foreach (var table in EventRoomAPI.LoadedEventRoom.meetingTables)
        {
            if (!meetingTablePrefabs.ContainsKey(table.type))
            {
                GameObject obj = (GameObject)Resources.Load("MeetingTables/" + table.type, typeof(GameObject));
                meetingTablePrefabs.Add(table.type, obj);
            }
            GameObject meetingTablePrefab = meetingTablePrefabs[table.type];
            tableObject = Instantiate(meetingTablePrefab, new Vector3(table.posX * X_OFFSET, meetingTablePrefab.transform.position.y, table.posY * Y_OFFSET), meetingTablePrefab.transform.rotation, transform);
            MeetingTable meetingTable = tableObject.GetComponent<MeetingTable>();
            meetingTable.SetTable(table);
        }
    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        LoadScene();

        LoadBackground();

        LoadMeetingTables();
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    void Awake()
    {
        SceneFader.StartFadeInScene();
    }
}
