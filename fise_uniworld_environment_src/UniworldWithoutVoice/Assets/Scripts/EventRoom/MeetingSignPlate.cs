using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class MeetingSignPlate : MonoBehaviour
{
    private TextMeshProUGUI[] labels;
    private RawImage[] logos;

    private void Awake()
    {
        labels = GetComponentsInChildren<TextMeshProUGUI>();
        logos = GetComponentsInChildren<RawImage>();
    }

    public void SetLabel(string labelText)
    {
        foreach (TextMeshProUGUI label in labels)
        {
            label.text = labelText;
        }
    }

    public void SetLogo(Texture2D logoTexture)
    {
        foreach (RawImage logo in logos)
        {
            logo.texture = logoTexture;
        }
    }
}
