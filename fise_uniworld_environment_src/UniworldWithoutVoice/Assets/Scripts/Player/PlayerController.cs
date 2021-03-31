using UnityEngine;
using Photon.Pun;

public class PlayerController : MonoBehaviourPun
{
    public static GameObject LocalInstance;
    public CharacterController controller;
    private Animator animator;
    public float turnSpeed = 130f;
    public float walkSpeed = 3f;
    public float runSpeed = 5f;
    public float gravity = -17f;
    public float jumpHeight = 1.3f;

    private bool isJumping = false;
    private bool isRunning = false;

    private bool camRunForward = false;

    private readonly int JUMP = Animator.StringToHash("Jump");
    private readonly int RUNNING = Animator.StringToHash("Running");
    private readonly int WALKING = Animator.StringToHash("Walking");

    private Vector3 velocity;

    public GameObject PlayerUIPrefab;

    private void Awake()
    {
        if(photonView.IsMine)
        {
            gameObject.tag = "Player";
            LocalInstance = gameObject;
        }
        animator = GetComponentInChildren<Animator>();

        GameObject playerUI = Instantiate(PlayerUIPrefab);
        playerUI.GetComponent<PlayerUI>().SetTarget(this);

        DontDestroyOnLoad(gameObject);
    }

    public static void SetCamRunForward(bool camRunForward)
    {
        LocalInstance.GetComponent<PlayerController>().camRunForward = camRunForward;
    }

    void TriggerAnimations()
    {
        if(Input.GetAxis("Vertical") == 0f && !camRunForward)
        {
            animator.SetBool(WALKING, false);
            animator.SetBool(RUNNING, false);
        }
        else
        {
            // Running
            if (Input.GetKey("left shift") || camRunForward)
            {
                animator.SetBool(WALKING, false);
                animator.SetBool(RUNNING, true);
                isRunning = true;
            }
            // Walking
            else
            {
                animator.SetBool(WALKING, true);
                animator.SetBool(RUNNING, false);
                isRunning = false;
            }
        }
    }

    void Update()
    {
        // Player controller will be ignored if this instance does not represent
        // the physical person playing on this device within this application
        if (!photonView.IsMine && PhotonNetwork.IsConnected)
        {
            return;
        }

        if (controller.isGrounded && velocity.y < 0)
        {
            isJumping = false;
            velocity.y = -0.5f;
        }

        // Jumping
        if (Input.GetButtonDown("Jump") && velocity.y < 0 && !isJumping)
        {
            velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
            isJumping = true;
            animator.SetTrigger(JUMP);
        }
        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);

        // Prevent movement when Chat GUI is focused
        if (ChatUI.Instance != null && !ChatUI.Instance.messageInputBox.isFocused)
        {
            //Animations
            TriggerAnimations();

            //Player Movement
            Vector3 move = transform.forward * Input.GetAxis("Vertical");
            float speed = isRunning ? runSpeed : walkSpeed;
            if (!camRunForward)
            {
                controller.Move(move * speed * Time.deltaTime);
            }
            else //Movement caused by FPS camera (Right click)
            {
                controller.Move(transform.forward * runSpeed * Time.deltaTime);
            }
            transform.Rotate(0, Input.GetAxis("Horizontal") * turnSpeed * Time.deltaTime, 0);
        }
    }
}
