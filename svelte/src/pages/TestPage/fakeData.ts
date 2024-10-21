import { Assignation } from "../../common/classes/Assignation";
import { Chat } from "../../common/classes/Chat";
import { Message } from "../../common/classes/Message";
import { Permission } from "../../common/classes/Permission";
import { Role } from "../../common/classes/Role";
import { Status } from "../../common/classes/Status";
import { User } from "../../common/classes/User";
import * as authentifier from "../../common/tools/_auth";

/**
 * @var {User} testUser Test user (connected user or a fake one)
 */
export const testUser: User =
	authentifier.getStoredUser() ??
	new User(
		-1,
		"User",
		"password",
		new Date(),
		Status.TYPE.ONLINE,
		[]
	);

/**
 * @var {User} testUser2 Second test user
 */
export const testUser2 = new User(
	-2,
	"User 2",
	"password",
	new Date(),
	Status.TYPE.ONLINE,
	[]
);

/**
 * @var {Chat} testChat Test chat
 */
export const testChat = new Chat(-1, "Test Chat", [], []);

/**
 * @var {Message} testMsg Test message
 */
export const testMsg = new Message(
	-1,
	"Test message",
	new Date(),
	testChat,
	testUser
);

/**
 * @var {Message} testMsg2 Second test message
 */
export const testMsg2 = new Message(
	-2,
	"Test message 2",
	new Date(),
	testChat,
	testUser2
);

/**
 * @var {Message} testMsg3 Third test message
 */
export const testMsg3 = new Message(
	-3,
	"Test message 3",
	new Date(),
	testChat,
	testUser
);

/**
 * @var {Message} testMsg4 Fourth test message
 */
export const testMsg4 = new Message(
	-4,
	"Test message 4",
	new Date(),
	testChat,
	testUser2
);

// Add messages to the chat
testChat.addMessage(testMsg);
testChat.addMessage(testMsg2);
testChat.addMessage(testMsg3);
testChat.addMessage(testMsg4);

/**
 * @var {Assignation} testAssignation Test assignation of the connected user or fake one
 */
export const testAssignation = new Assignation(
	-1,
	Role.TYPE.ADMIN,
	Permission.TYPE.ALLOWED,
	testChat,
	testUser
);
/**
 * @var {Assignation} testAssignation2 Second test assignation of the second user
 */
export const testAssignation2 = new Assignation(
	-2,
	Role.TYPE.ADMIN,
	Permission.TYPE.ALLOWED,
	testChat,
	testUser2
);

// Add assignations to the chat
testChat.addAssignation(testAssignation);
testChat.addAssignation(testAssignation2);
