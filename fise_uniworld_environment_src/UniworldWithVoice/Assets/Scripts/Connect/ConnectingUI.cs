using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ConnectingUI : MonoBehaviour
{
    private static CanvasGroup canvas;

    private void Awake()
    {
        canvas = GetComponent<CanvasGroup>();
    }

    public static void Show()
    {
        canvas.alpha = 1f;
    }

    public static void Hide()
    {
        canvas.alpha = 0f;
    }
}
