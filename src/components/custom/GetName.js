const getClientName = (clients = [], clientId) => {
    const temp = clients.filter(client => client.ClientId == clientId)
    return temp[0].ClientName;
}

const getExpertName = (experts = [], expertId) => {
    const temp = experts.filter(expert => expert.ExpertId == expertId);
    return temp[0].ExpertName;
}

const getCaseName = (cases = [], caseId) => {
    const temp = cases.filter(item => item.CaseId == caseId);
    return temp[0].CaseName;
}

const getMemberIdByName = (members = [], name) => {
    const temp = members.filter(member => member.MemberName == name);
    return temp[0].ChatMember;
}

const getPackageById = (packages = [], pkgId) => {
    const temp = packages.filter(member => member.PackageId == pkgId);
    return temp[0];
}

export { getClientName, getExpertName, getCaseName, getMemberIdByName, getPackageById };