[ { '@type': 'd',
    '@class': 'test',
    name: 'testrec',
    description: 'this is a test',
    link: null,
    '@rid': { [String: '#17:12'] cluster: 17, position: 12 },
    '@version': 1 } ]

.then(function (res) {
            data = res[0];
            data['@rid'] = '#'+data['@rid'].cluster+':'+data['@rid'].position

            return data;
        })