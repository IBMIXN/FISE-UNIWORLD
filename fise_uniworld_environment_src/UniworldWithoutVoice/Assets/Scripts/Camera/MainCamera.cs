using UnityEngine;
using UnityEngine.SceneManagement;

public class MainCamera : MonoBehaviour
{
    private Camera cam;

    void Awake()
    {
        cam = GetComponent<Camera>();
        DontDestroyOnLoad(gameObject);
        EnableMainCam();
    }

    void EnableMainCam()
    {
        cam.enabled = true;
    }

    void DisableMainCam()
    {
        cam.enabled = false;
    }

    void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        if(scene.name != "Connect")
        {
            cam.cullingMask = 0;
        }
        else
        {
            cam.cullingMask = -1;
        }
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    private void Update()
    {
        if(Camera.allCameras.Length > 1)
        {
            DisableMainCam();
        } 
        else if(Camera.allCameras.Length == 0) { 
            EnableMainCam();
        }
    }
}
