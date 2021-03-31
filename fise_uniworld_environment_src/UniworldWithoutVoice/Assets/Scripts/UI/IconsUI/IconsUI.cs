using UnityEngine;
using UnityEngine.SceneManagement;

public class IconsUI : MonoBehaviour
{
    public static IconsUI Instance;
    private CanvasGroup iconsCanvas;

    private void Awake()
    {
        if (!Instance)
        {
            Instance = this;
            iconsCanvas = GetComponentInChildren<CanvasGroup>();
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
            Hide();
        }
        else
        {
            Show();
        }
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    public static void Show()
    {
        CanvasUtils.Show(Instance.iconsCanvas);
    }

    public static void Hide()
    {
        CanvasUtils.Hide(Instance.iconsCanvas);
    }
}
