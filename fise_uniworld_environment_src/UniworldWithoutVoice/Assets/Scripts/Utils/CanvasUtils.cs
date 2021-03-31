using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CanvasUtils : MonoBehaviour
{
    public static void Show(CanvasGroup canvas)
    {
        canvas.alpha = 1f;
        canvas.interactable = true;
        canvas.blocksRaycasts = true;
    }

    public static void Hide(CanvasGroup canvas)
    {
        canvas.alpha = 0f;  //makes the canvas group invisible
        canvas.interactable = false;
        canvas.blocksRaycasts = false;  //prevents UI element from receiving input events
    }
}
