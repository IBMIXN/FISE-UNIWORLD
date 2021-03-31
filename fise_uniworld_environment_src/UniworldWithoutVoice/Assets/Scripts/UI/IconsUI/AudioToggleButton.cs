using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class AudioToggleButton : MonoBehaviour
{
    private Button button;
    private RawImage rawImage;
    public Texture audioIcon, mutedAudioIcon;
    public bool muted = false;

    void Awake()
    {
        button = GetComponent<Button>();
        rawImage = GetComponent<RawImage>();
        button.onClick.AddListener(OnClick);
    }

    private void OnClick()
    {
        if (muted)
        {
            muted = false;
            rawImage.texture = audioIcon;
            // Disable audio here
        }
        else
        {
            muted = true;
            rawImage.texture = mutedAudioIcon;
            // Enable audio here
        }
    }

    void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        if (scene.name != "Connect")
        {
            muted = false;
            rawImage.texture = audioIcon;
            // Enable audio here
        }
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }
}
