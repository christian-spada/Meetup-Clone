import { csrfFetch } from '../store/csrf';

export const setMembershipStatus = (groupId, user, setMemberStatus) => {
	csrfFetch(`/api/groups/${groupId}/members`)
		.then(res => res.json())
		.then(data => data.Members.filter(member => member.id === user.id)[0])
		.then(userMemberData => setMemberStatus(userMemberData.Membership.status));
};
