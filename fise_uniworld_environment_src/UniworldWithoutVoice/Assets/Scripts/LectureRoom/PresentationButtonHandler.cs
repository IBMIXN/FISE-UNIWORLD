using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PresentationButtonHandler : MonoBehaviour
{
    public bool nextSlideButton = true;
    private Button button;

    private void Awake()
    {
        button = GetComponent<Button>();
    }

    private void OnEnable()
    {
        button.onClick.AddListener(OnClickHandle);
    }

    private void OnDisable()
    {
        button.onClick.RemoveAllListeners();
    }

    private void OnClickHandle()
    {
        if(PresentationSlide.Instance != null)
        {
            if (nextSlideButton)
            {
                PresentationSlide.Instance.NextSlide();
            }
            else
            {
                PresentationSlide.Instance.PrevSlide();
            }
        }
    }
}
