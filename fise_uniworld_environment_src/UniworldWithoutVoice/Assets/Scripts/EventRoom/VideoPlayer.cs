using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VideoPlayer : MonoBehaviour
{
    public static VideoPlayer Instance;
    private UnityEngine.Video.VideoPlayer videoPlayer;
    public RenderTexture texture;
    private Material skyboxMaterial;

    private void Awake()
    {
        Instance = this;
        videoPlayer = GetComponent<UnityEngine.Video.VideoPlayer>();
        skyboxMaterial = new Material(Shader.Find("Skybox/Panoramic"));
        skyboxMaterial.mainTexture = texture;
        videoPlayer.targetTexture = texture;
    }

    public static void PlayVideo(UnityEngine.Video.VideoClip clip)
    {
        RenderSettings.skybox = Instance.skyboxMaterial;
        Instance.videoPlayer.enabled = true;
        Instance.videoPlayer.source = UnityEngine.Video.VideoSource.VideoClip;
        Instance.videoPlayer.clip = clip;
        Instance.videoPlayer.Play();
    }

    public static void PlayVideoUrl(string url)
    {
        Debug.Log(url);
        RenderSettings.skybox = Instance.skyboxMaterial;
        Instance.videoPlayer.enabled = true;
        Instance.videoPlayer.source = UnityEngine.Video.VideoSource.Url;
        Instance.videoPlayer.url = url;
        Instance.videoPlayer.Play();
    }
}
