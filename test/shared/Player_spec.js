/*jslint node: true */
/*global describe, it, expect, beforeEach, afterEach */
'use strict';

var SOG = SOG || {};
SOG.shared = SOG.shared || {};

describe('A Player', function () {
	var p1_data, p1;

	beforeEach(function () {
		p1_data = { "id": "1484527814", "name": "Christian Nilsson", "first_name": "Christian", "username": "christiannilsson4", "locale": "sv_SE", "link": "http://www.facebook.com/christiannilsson4", "picture": { "data": { "url": "http://profile.ak.fbcdn.net/static-ak/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif", "is_silhouette": true } }, "friends": { "data": [ { "id": "519285999", "name": "Daniel Bjerke", "first_name": "Daniel", "username": "daniel.bjerke.3", "picture": { "data": { "url": "http://profile.ak.fbcdn.net/hprofile-ak-ash4/372728_519285999_943655330_q.jpg", "is_silhouette": false } } }, { "id": "534842255", "name": "Martin Täljemark", "first_name": "Martin", "username": "martin.taljemark", "picture": { "data": { "url": "http://profile.ak.fbcdn.net/hprofile-ak-ash4/186293_534842255_1588839460_q.jpg", "is_silhouette": false } } }, { "id": "549241589", "name": "Sebastian Tg Wihlborg", "first_name": "Sebastian", "username": "sebastian.wihlborg", "picture": { "data": { "url": "http://profile.ak.fbcdn.net/hprofile-ak-snc6/273318_549241589_2833345_q.jpg", "is_silhouette": false } } }, { "id": "549739225", "name": "Filip Nilsson", "first_name": "Filip", "username": "filip.nilsson.165", "picture": { "data": { "url": "http://profile.ak.fbcdn.net/hprofile-ak-prn1/41403_549739225_4507_q.jpg", "is_silhouette": false } } }, { "id": "551127852", "name": "Örjan Nilsson", "first_name": "Örjan", "username": "ojje93", "picture": { "data": { "url": "http://profile.ak.fbcdn.net/hprofile-ak-ash3/174349_551127852_7837274_q.jpg", "is_silhouette": false } } }, { "id": "100002627131122", "name": "Gunilla Nilsson", "first_name": "Gunilla", "username": "gunilla.nilsson.94", "picture": { "data": { "url": "http://profile.ak.fbcdn.net/hprofile-ak-snc6/260982_100002627131122_3363665_q.jpg", "is_silhouette": false } } } ], "paging": { "next": "https://graph.facebook.com/1484527814/friends?fields=id,name,first_name,username,picture&limit=5000&offset=5000&__after_id=100002627131122" } } };
		p1 = new SOG.shared.Player(p1_data);
	});

	it('get("name") should return data depending on param', function () {
		expect(p1.get('name')).toBe('Christian Nilsson');
	});

	it('get("all") should return all data', function () {
		expect(p1.get('all')).toBe(p1_data);
	});

	it('listFriends("id") should return id of all friends', function () {
		expect(p1.listFriends('id')).toEqual([
			p1_data.friends.data[0].id,
			p1_data.friends.data[1].id,
			p1_data.friends.data[2].id,
			p1_data.friends.data[3].id,
			p1_data.friends.data[4].id,
			p1_data.friends.data[5].id
		]);
	});

	it('listFriends("name") should return name of all friends', function () {
		expect(p1.listFriends('name')).toContain("Daniel Bjerke");
	});

	it('getFriends(["549241589", "100002627131122"]) should return data about friends with right id', function () {
		expect(p1.getFriends(['549241589', '100002627131122'])).toEqual([
			p1_data.friends.data[2],
			p1_data.friends.data[5]
		]);
	});
});
