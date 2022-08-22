export function isEmail(asValue) {
	const regExp =
		/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return regExp.test(asValue);
}

export function isPassword(pw) {
	// let regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,}$/
	// return regExp.test(asValue)
	const num = pw.search(/[0-9]/g);
	const eng = pw.search(/[a-z]/gi);
	const spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

	if (pw.length < 6 || pw.length > 20) {
		// alert("8자리 ~ 20자리 이내로 입력해주세요.");
		return false;
	}
	if (pw.search(/\s/) != -1) {
		// alert("비밀번호는 공백 없이 입력해주세요.");
		return false;
	}
	if (num < 0 || eng < 0 || spe < 0) {
		// alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
		return false;
	}
	// console.log("통과");
	return true;
}

export function isTel(asValue) {
	const regExp = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;
	return regExp.test(asValue);
}

export function isPhone(asValue) {
	const regExp = /^01([0|1|6|7|8|9]?)?([0-9]{3,4})?([0-9]{4})$/g;
	return regExp.test(asValue);
}
