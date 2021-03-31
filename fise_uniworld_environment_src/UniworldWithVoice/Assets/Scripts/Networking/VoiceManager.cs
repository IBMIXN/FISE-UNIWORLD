using FrostweepGames.Plugins.Native;
using FrostweepGames.VoicePro;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class VoiceManager : MonoBehaviour
{
    public static VoiceManager Instance;

    private Recorder recorder;
    private Listener listener;

    private void Awake()
    {
        if(Instance == null)
        {
            recorder = GetComponent<Recorder>();
            listener = GetComponent<Listener>();
            DontDestroyOnLoad(gameObject);
            Instance = this;
        }
        else if (this != Instance)
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        CustomMicrophone.RequestMicrophonePermission();
        recorder.RecordStartedEvent += HandleRecordStartedEvent;
        recorder.RecordFailedEvent += HandleRecordFailedEvent;
    }

    void HandleRecordStartedEvent()
    {
        Debug.Log("mics: " + CustomMicrophone.devices.Length);
        Debug.Log(CustomMicrophone.HasConnectedMicrophoneDevices() + "," + CustomMicrophone.HasMicrophonePermission() + "," + CustomMicrophone.devices[0]);
        Debug.Log("Record started successfully!");
    }

    void HandleRecordFailedEvent(string res)
    {
        Debug.Log("Error! Failed to start recording.");
        Debug.Log(res);
    }

    private void Update()
    {
        if(OnlineUsersUI.Instance != null)
        {
            foreach (KeyValuePair<int, Speaker> speaker in listener.Speakers)
            {
                OnlineUsersUI.SetUserSpeakingIcon(speaker.Key, speaker.Value.Playing);
            }
        }
    }

    public static void MuteMic()
    {
        Instance.recorder.StopRecord();
    }
    public static void UnmuteMic()
    {
        Instance.recorder.StartRecord();
    }

    public static void MuteAudio()
    {
        Instance.listener.SetMuteStatus(true);
    }

    public static void UnmuteAudio()
    {
        Instance.listener.SetMuteStatus(false);
    }

    private static void ToggleDebugEcho(bool status)
    {
        Instance.recorder.debugEcho = status;
    }

    private static void ToggleReliableTransmission(bool status)
    {
        Instance.recorder.reliableTransmission = status;
    }

    private static void ToggleVoiceDetection(bool status)
    {
        Instance.recorder.voiceDetectionEnabled = status;
    }

    private static void SetVoiceDetectionThreshold(float value)
    {
        Instance.recorder.voiceDetectionThreshold = value;
    }

    void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        if (scene.name != "Connect")
        {
            listener.StartListen();
        }
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
        recorder.RecordStartedEvent -= HandleRecordStartedEvent;
        recorder.RecordFailedEvent -= HandleRecordFailedEvent;
    }
}