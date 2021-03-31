using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ConnectButton : MonoBehaviour
{
    private Button button;
    private TMP_InputField inputField;

    void Start()
    {
        inputField = GameObject.Find("NicknameInput").GetComponent<TMP_InputField>();
        button = GetComponent<Button>();
        button.onClick.AddListener(ConnectUser);
        ConnectingUI.Hide();
    }

    private void ConnectUser()
    {
        string nickname = inputField.text;
        if (!string.IsNullOrWhiteSpace(nickname))
        {
            ConnectingUI.Show();
            NetworkManager.Connect(nickname);
        }
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Return))
        {
            ConnectUser();
        }
    }
}
