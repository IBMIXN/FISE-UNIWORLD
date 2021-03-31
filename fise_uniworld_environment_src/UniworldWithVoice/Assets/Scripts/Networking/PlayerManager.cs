using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;
using Photon.Pun;
using System;
using System.Collections.Generic;
public class PlayerManager : MonoBehaviourPun
{
    private readonly static string PREFAB_PATH = "Avatars/";
    public static PlayerManager Instance;
    public GameObject[] avatars;
    private Dictionary<string, GameObject> avatarList;

    private string selectedAvatar = "Y Bot";

    void Awake()
    {
        if(Instance == null)
        {
            DontDestroyOnLoad(gameObject);
            Instance = this;
            avatarList = new Dictionary<string, GameObject>();
            foreach(GameObject av in avatars)
            {
                avatarList.Add(av.name, av);
            }
        }
        else if(this != Instance)
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
        if(scene.name != "Connect")
        {
            StartCoroutine(DelayedSpawn());
        }
    }

    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    public static void SelectAvatar(string avatarName)
    {
        Instance.selectedAvatar = avatarName;
    }

    IEnumerator DelayedSpawn()
    {
        GameObject avatar = avatarList[selectedAvatar];
        yield return new WaitForSeconds(1f);
        if (PlayerController.LocalInstance == null)
        {
            bool spawned = false;
            GameObject[] spawnPoints = GameObject.FindGameObjectsWithTag("PlayerSpawnPoint");
            if (spawnPoints != null && spawnPoints.Length >= 1)
            {
                foreach (GameObject spawnPoint in spawnPoints)
                {
                    if (spawnPoint.GetComponent<PlayerSpawnPoint>().ShouldSpawnHere())
                    {
                        print("Instantiating player...");
                        PhotonNetwork.Instantiate(PREFAB_PATH + avatar.name + "/" + avatar.name, spawnPoint.transform.position, spawnPoint.transform.rotation, 0);
                        spawned = true;
                        break;
                    }
                }
            }
            if (!spawned)
            {
                PhotonNetwork.Instantiate(PREFAB_PATH + avatar.name + "/" + avatar.name, new Vector3(0, 5, 0), Quaternion.identity, 0);
            }
        }
    }
}
