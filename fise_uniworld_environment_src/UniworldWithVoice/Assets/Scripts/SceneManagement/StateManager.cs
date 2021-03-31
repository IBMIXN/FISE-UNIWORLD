using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StateManager : MonoBehaviour
{
    public static string PreviousScene = "Main";

    void Awake()
    {
        DontDestroyOnLoad(gameObject);
    }
}
