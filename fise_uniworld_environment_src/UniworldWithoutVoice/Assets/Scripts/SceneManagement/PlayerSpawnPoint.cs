using UnityEngine;

public class PlayerSpawnPoint : MonoBehaviour
{
    public string fromScene = "Main";

    public bool ShouldSpawnHere()
    {
        return StateManager.PreviousScene == fromScene;
    }
}
